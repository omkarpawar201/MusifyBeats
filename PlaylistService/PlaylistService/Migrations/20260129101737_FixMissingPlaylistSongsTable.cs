using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlaylistService.Migrations
{
    /// <inheritdoc />
    public partial class FixMissingPlaylistSongsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /*
            migrationBuilder.DropForeignKey(
                name: "FK_PlaylistSongs_Playlists_PlaylistId",
                table: "PlaylistSongs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Playlists",
                table: "Playlists");

            migrationBuilder.DropIndex(
                name: "IX_Playlists_OwnerEmail",
                table: "Playlists");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PlaylistSongs",
                table: "PlaylistSongs");

            migrationBuilder.DropIndex(
                name: "IX_PlaylistSongs_PlaylistId",
                table: "PlaylistSongs");

            migrationBuilder.DropColumn(
                name: "OwnerEmail",
                table: "Playlists");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PlaylistSongs");

            migrationBuilder.RenameTable(
                name: "Playlists",
                newName: "playlists");

            migrationBuilder.RenameTable(
                name: "PlaylistSongs",
                newName: "playlist_songs");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "playlists",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "playlists",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "playlists",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "IsPublic",
                table: "playlists",
                newName: "is_public");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "playlists",
                newName: "created_at");

            migrationBuilder.RenameIndex(
                name: "IX_Playlists_IsPublic",
                table: "playlists",
                newName: "IX_playlists_is_public");

            migrationBuilder.RenameColumn(
                name: "SongId",
                table: "playlist_songs",
                newName: "song_id");

            migrationBuilder.RenameColumn(
                name: "PlaylistId",
                table: "playlist_songs",
                newName: "playlist_id");

            migrationBuilder.RenameColumn(
                name: "AddedAt",
                table: "playlist_songs",
                newName: "added_at");

            migrationBuilder.AddColumn<long>(
                name: "user_id",
                table: "playlists",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AlterColumn<int>(
                name: "song_id",
                table: "playlist_songs",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("Relational:ColumnOrder", 1);

            migrationBuilder.AlterColumn<int>(
                name: "playlist_id",
                table: "playlist_songs",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("Relational:ColumnOrder", 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_playlists",
                table: "playlists",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_playlist_songs",
                table: "playlist_songs",
                columns: new[] { "playlist_id", "song_id" });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    display_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_playlists_user_id",
                table: "playlists",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_playlist_songs_playlists_playlist_id",
                table: "playlist_songs",
                column: "playlist_id",
                principalTable: "playlists",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_playlists_users_user_id",
                table: "playlists",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
            */

             // Manually create JUST the playlist_songs table which is confirmed missing
             migrationBuilder.CreateTable(
                name: "playlist_songs",
                columns: table => new
                {
                    playlist_id = table.Column<int>(type: "int", nullable: false),
                    song_id = table.Column<int>(type: "int", nullable: false),
                    added_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_playlist_songs", x => new { x.playlist_id, x.song_id });
                    table.ForeignKey(
                        name: "FK_playlist_songs_playlists_playlist_id",
                        column: x => x.playlist_id,
                        principalTable: "playlists",
                        principalColumn: "Id", // Point to 'Id' (PascalCase) likely in DB
                        onDelete: ReferentialAction.Cascade);
                });
            
            // Re-create the index
             migrationBuilder.CreateIndex(
                name: "IX_playlist_songs_playlist_id",
                table: "playlist_songs",
                column: "playlist_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_playlist_songs_playlists_playlist_id",
                table: "playlist_songs");

            migrationBuilder.DropForeignKey(
                name: "FK_playlists_users_user_id",
                table: "playlists");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_playlists",
                table: "playlists");

            migrationBuilder.DropIndex(
                name: "IX_playlists_user_id",
                table: "playlists");

            migrationBuilder.DropPrimaryKey(
                name: "PK_playlist_songs",
                table: "playlist_songs");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "playlists");

            migrationBuilder.RenameTable(
                name: "playlists",
                newName: "Playlists");

            migrationBuilder.RenameTable(
                name: "playlist_songs",
                newName: "PlaylistSongs");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Playlists",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Playlists",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Playlists",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "is_public",
                table: "Playlists",
                newName: "IsPublic");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Playlists",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "IX_playlists_is_public",
                table: "Playlists",
                newName: "IX_Playlists_IsPublic");

            migrationBuilder.RenameColumn(
                name: "added_at",
                table: "PlaylistSongs",
                newName: "AddedAt");

            migrationBuilder.RenameColumn(
                name: "song_id",
                table: "PlaylistSongs",
                newName: "SongId");

            migrationBuilder.RenameColumn(
                name: "playlist_id",
                table: "PlaylistSongs",
                newName: "PlaylistId");

            migrationBuilder.AddColumn<string>(
                name: "OwnerEmail",
                table: "Playlists",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "SongId",
                table: "PlaylistSongs",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("Relational:ColumnOrder", 1);

            migrationBuilder.AlterColumn<int>(
                name: "PlaylistId",
                table: "PlaylistSongs",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("Relational:ColumnOrder", 0);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "PlaylistSongs",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Playlists",
                table: "Playlists",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlaylistSongs",
                table: "PlaylistSongs",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Playlists_OwnerEmail",
                table: "Playlists",
                column: "OwnerEmail");

            migrationBuilder.CreateIndex(
                name: "IX_PlaylistSongs_PlaylistId",
                table: "PlaylistSongs",
                column: "PlaylistId");

            migrationBuilder.AddForeignKey(
                name: "FK_PlaylistSongs_Playlists_PlaylistId",
                table: "PlaylistSongs",
                column: "PlaylistId",
                principalTable: "Playlists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
